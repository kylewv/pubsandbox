const PercyScript = require('@percy/script');
const yaml = require('js-yaml');
const fs = require('fs');

const tests = yaml.load(fs.readFileSync('./tests/percy/test_sites.yml', 'utf8'));
const site = process.env.BASE_URL;
const percyBranch = process.env.PERCY_BRANCH;
const percyTargetBranch = process.env.PERCY_TARGET_BRANCH;
const baseUrl = percyBranch === 'production' ? 'https://carleton.edu/' : 'https://staging.wsg-gke.carleton.edu/';

let promise = PercyScript.run(async (page, percySnapshot) => {
	console.log(tests, 'tests');
	for (const test of tests) {
		console.log(test);
		if(baseUrl === 'production'){
			await page.goto(baseUrl + test.prodPath);
			await page.waitFor(test.prodWaitFor);
			await percySnapshot(test.name);
		}else{
			await page.goto(baseUrl + test.stagingPath);
			await page.waitFor(test.stagingWaitFor);
			await percySnapshot(test.name);
		}
	}
});
