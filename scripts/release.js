import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function ask(question) {
	return new Promise(resolve => rl.question(question, resolve));
}

async function run() {
	try {
		const msg = (await ask('Commit message: ')).trim();

		if (!msg) {
			console.log('❌ Commit message required');
			process.exit(1);
		}

		console.log('\nSelect version:');
		console.log('1) patch');
		console.log('2) minor');
		console.log('3) major');

		const choice = (await ask('Choose (1/2/3): ')).trim();

		const map = {
			1: 'patch',
			2: 'minor',
			3: 'major',
		};

		const version = map[choice];

		if (!version) {
			console.log('❌ Invalid choice');
			process.exit(1);
		}

		console.log(`\n🚀 Releasing ${version}...\n`);

		execSync(`git add .`, { stdio: 'inherit' });
		execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, {
			stdio: 'inherit',
		});
		execSync(`npm version ${version}`, { stdio: 'inherit' });
		execSync(`git push --follow-tags`, { stdio: 'inherit' });

		console.log('\n✅ Release completed');
	} catch (e) {
		console.log('\n❌ Release failed');
		process.exit(1);
	} finally {
		rl.close();
	}
}

run();
