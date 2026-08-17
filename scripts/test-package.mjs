import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(fileURLToPath(new URL('..', import.meta.url)));

const npmCli = process.env.npm_execpath;

if (npmCli === undefined || npmCli.length === 0) {
  throw new Error('npm_execpath is not available.');
}

const runNpm = (args, options = {}) =>
  run(process.execPath, [npmCli, ...args], options);

const tempDir = mkdtempSync(join(tmpdir(), 'ticketbaiws-package-test-'));

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? rootDir,
    encoding: 'utf8',
    stdio: options.capture ? 'pipe' : 'inherit',
  });

  if (result.status !== 0) {
    if (options.capture) {
      if (result.stdout) {
        process.stdout.write(result.stdout);
      }

      if (result.stderr) {
        process.stderr.write(result.stderr);
      }
    }

    throw new Error(`Command failed: ${command} ${args.join(' ')}`);
  }

  return result;
};

try {
  runNpm(['pack', '--dry-run=false', '--pack-destination', tempDir]);

  const tarballs = readdirSync(tempDir).filter((file) => file.endsWith('.tgz'));

  if (tarballs.length !== 1) {
    throw new Error(`Expected exactly one tarball, found ${tarballs.length}.`);
  }

  const tarballPath = join(tempDir, tarballs[0]);

  const packageJson = JSON.parse(
    readFileSync(join(rootDir, 'package.json'), 'utf8'),
  );

  if (typeof packageJson.name !== 'string' || packageJson.name.length === 0) {
    throw new Error('package.json does not contain a valid package name.');
  }

  const packageName = packageJson.name;

  const packageDir = join(tempDir, 'node_modules', ...packageName.split('/'));

  runNpm(['init', '-y'], {
    cwd: tempDir,
    capture: true,
  });

  runNpm(
    [
      'install',
      tarballPath,
      '--dry-run=false',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
      '--no-package-lock',
      '--no-save',
    ],
    {
      cwd: tempDir,
    },
  );

  if (!existsSync(packageDir)) {
    throw new Error(`Installed package not found at ${packageDir}.`);
  }

  const requiredPackagePaths = [
    'lib/index.js',
    'lib/index.d.ts',
    'README.md',
    'LICENSE',
  ];

  for (const requiredPath of requiredPackagePaths) {
    if (!existsSync(join(packageDir, requiredPath))) {
      throw new Error(`Required package path is missing: ${requiredPath}.`);
    }
  }

  const forbiddenPackagePaths = ['src', 'test', 'docs'];

  for (const forbiddenPath of forbiddenPackagePaths) {
    if (existsSync(join(packageDir, forbiddenPath))) {
      throw new Error(`Unexpected package path found: ${forbiddenPath}.`);
    }
  }

  const consumerPackageJson = join(tempDir, 'package.json');

  writeFileSync(
    consumerPackageJson,
    JSON.stringify(
      {
        private: true,
        type: 'module',
      },
      null,
      2,
    ),
    'utf8',
  );

  const runtimeFile = join(tempDir, 'runtime.mjs');

  writeFileSync(
    runtimeFile,
    `import {
	TicketBaiWsClient,
	TicketBaiWsError
} from '${packageName}';

const fetchImplementation = async () =>
	new Response(
		JSON.stringify({
			result: 'OK',
			return: [],
			msg: null
		}),
		{
			status: 200,
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);

const client = new TicketBaiWsClient({
	token: 'test-token',
	issuerNif: '00000014Z',
	environment: 'test',
	fetch: fetchImplementation
});

const methods = [
	client.system.status,
	client.invoices.create,
	client.validation.aeat,
	client.companies.create,
	client.licenses.list,
	client.webhooks.list,
	client.verifactu.representation.getTemplate,
	client.bizkaia.epigraphs.list,
	client.bizkaia.lroe.receivedInvoices.list,
	client.bizkaia.lroe.cashCollections.list,
	client.bizkaia.lroe.cashPayments.list
];

if (
	methods.some(
		method =>
			typeof method !== 'function'
	)
) {
	throw new Error(
		'One or more public methods are missing from the installed package.'
	);
}

if (
	!(
		new TicketBaiWsError(
			'test'
		)
		instanceof Error
	)
) {
	throw new Error(
		'Public error hierarchy is not available from the installed package.'
	);
}

console.log(
	'Runtime package smoke test OK.'
);
`,
    'utf8',
  );

  const typecheckFile = join(tempDir, 'typecheck.ts');

  writeFileSync(
    typecheckFile,
    `import {
	TicketBaiWsClient,
	type TicketBaiWsClientOptions,
	type TicketBaiWsCreateCompanyRequest,
	type TicketBaiWsCreateInvoiceRequest,
	type TicketBaiWsRepresentationUploadRequest,
	type TicketBaiWsViesValidationRequest,
	type TicketBaiWsMutateLroeCashCollectionsRequest,
	type TicketBaiWsMutateLroeCashPaymentsRequest,
	type TicketBaiWsCreateLroeReceivedInvoicesRequest
} from '${packageName}';

const options: TicketBaiWsClientOptions = {
	token: 'test-token',
	issuerNif: '00000014Z',
	environment: 'test',
	fetch: async () =>
		new Response(
			JSON.stringify({
				result: 'OK',
				return: [],
				msg: null
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json'
				}
			}
		)
};

const client =
	new TicketBaiWsClient(
		options
	);

const invoice:
	TicketBaiWsCreateInvoiceRequest = {
	fecha: '17/08/2026',
	hora: '12:00:00',
	simplificada: true,
	serie: 'S',
	numero: '1',
	rectificativa: false,
	retencion: 0,
	lineas: [
		{
			cantidad: 1,
			importe_unitario: 10,
			tipo_iva: 21,
			tipo_req: 0
		}
	],
	total_factura: 12.1
};

const company:
	TicketBaiWsCreateCompanyRequest = {
	nombre_social: 'Empresa S.L.',
	nif: 'B01000012',
	direccion: 'Calle 1',
	poblacion: 'Bilbao',
	provincia: 'Bizkaia',
	cp: '48001',
	diputacion: 2
};

const vies:
	TicketBaiWsViesValidationRequest = {
	nif: 'B01000012',
	pais: 'ES'
};

const receivedInvoices:
	TicketBaiWsCreateLroeReceivedInvoicesRequest = {
	ejercicio: 2026,
	facturas: []
};

const collections:
	TicketBaiWsMutateLroeCashCollectionsRequest = {
	ejercicio: 2026,
	cobros: []
};

const payments:
	TicketBaiWsMutateLroeCashPaymentsRequest = {
	ejercicio: 2026,
	pagos: []
};

const upload:
	TicketBaiWsRepresentationUploadRequest = {
	file: new Blob(
		['pdf'],
		{
			type: 'application/pdf'
		}
	)
};

void client;
void invoice;
void company;
void vies;
void receivedInvoices;
void collections;
void payments;
void upload;
`,
    'utf8',
  );

  const tsconfigFile = join(tempDir, 'tsconfig.json');

  writeFileSync(
    tsconfigFile,
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          strict: true,
          noEmit: true,
          skipLibCheck: false,
        },
        include: ['typecheck.ts'],
      },
      null,
      2,
    ),
    'utf8',
  );

  run('node', [runtimeFile], {
    cwd: tempDir,
  });

  const tscPath = join(rootDir, 'node_modules', 'typescript', 'bin', 'tsc');

  if (!existsSync(tscPath)) {
    throw new Error(
      'TypeScript compiler not found. Run npm install before test:package.',
    );
  }

  run('node', [tscPath, '--project', tsconfigFile], {
    cwd: tempDir,
  });

  console.log('Type declaration package smoke test OK.');
} finally {
  rmSync(tempDir, {
    recursive: true,
    force: true,
  });
}
