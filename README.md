# json-resume-converter-html
Will convert a resume from json to html

## Installation

    npm install json-resume-converter-html

## Usage

Validation of the json input:

```bash
node index.js validate <jsonFile>
```

Converting to html:
```bash
node index.js convert [options] <file> <outputFolder>
```

Convert the json provided by `<file>` to html file in the `<outputFolder>`

Options:

	-h, --help               output usage information
	-p, --photo <photoPath>  add photo
	-s, --style <style>      add style (the name should be an existing <style>.less file (ex: simple))
