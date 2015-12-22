const program = require('commander')
const colors = require('colors')
const validate = require('jsonschema').validate
const fs = require('fs')

program
	.version('0.0.1')

program
  .command('validate <file>')
	.description('Validate the json provided by <file>')
	.action(validateFile)

program
   .command('*')
   .description('help')
   .action(function(env) {
     console.error(colors.red('no command found!'))
		 program.outputHelp(txt => colors.red(txt))
   })

program.parse(process.argv);

function validateFile(file){
	console.log(colors.green('Validating ' + file));
	fs.readFile('./resume-schema.json', 'utf8', function (err, schema) {
		if (err) throw err;
		var jsonSchema = JSON.parse(schema)
		fs.readFile(file, 'utf8', function (err, jsonTxt) {
			if (err) throw err;
			var json = JSON.parse(jsonTxt)
			var result = validate(json, jsonSchema)
			if (result.valid) {
				console.log(colors.green('Succeeded'))
				return true
			}
			else {
				console.log(colors.red(result.errors))
				return false
			}
		})
	})
}
