Development
-----------

Clone repo and install dev dependencies:

```bash
git clone https://github.com/fvdm/nodejs-cloudsight
cd nodejs-cloudsight
npm install
```

Commit your changes, requirements:
* Describe the change in less than 140 chars.
* Commit more often with small edits instead of one commit with mixed bugfixes and new features.
* Submit a new PR for each patch and new feature.
* Tag related Github issue in commit message, i.e. `Added coolFeature() #123`
* Commits not in main code _index.js_ should be prefixed with:
  * `Package:` for _package.json_ edits
  * `Test:` for testing related edits like _test.js_ or _.eslintrc_ or _.travis.yml_
  * `Readme:` for _README.md_ or _CONTRIBUTING.md_ edits
* English only.
* Stick to the code style.
* JSdoc the functions.
* Give anonymous functions a name for the error reports.
* Run `eslint .`
