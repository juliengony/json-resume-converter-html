const program = require('commander')
const colors = require('colors')
const validate = require('jsonschema').validate
const fs = require('fs')

colors.setTheme({
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});


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
     console.error('no command found!'.error)
		 program.outputHelp(txt => txt.data)
   })

program.parse(process.argv);

function validateFile(file){
	console.log(('Validating ' + file).info);
	fs.readFile('./resume-schema.json', 'utf8', function (err, schema) {
		if (err) throw err;
		var jsonSchema = JSON.parse(schema)
		fs.readFile(file, 'utf8', function (err, jsonTxt) {
			if (err) throw err;
			var json = JSON.parse(jsonTxt)
			var result = validate(json, jsonSchema)
			if (result.valid) {
				console.log('Succeeded'.info)
				return true
			}
			else {
				console.log(colors.error(result.errors))
				return false
			}
		})
	})
}
