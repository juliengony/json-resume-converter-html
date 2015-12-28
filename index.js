const program = require('commander')
const colors = require('colors')
const validate = require('jsonschema').validate
const fs = require('fs')
const jade = require('jade')
const moment = require('moment')
require("moment-duration-format")

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
  .command('convert <file> <outputHtml>')
	.description('Convert the json provided by <file> to html file <outputHtml>')
	.action(convertFile)

program
   .command('*')
   .description('help')
   .action(function(env) {
     console.error('no command found!'.error)
		 program.outputHelp(txt => txt.data)
   })

program.parse(process.argv);

function validateFile(file){
	console.log(('Validating ' + file).info)
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

function convertFile(file, outputHtml){
	console.log(('Converting ' + file + ' to ' + outputHtml).info)
	fs.readFile(file, 'utf8', function (err, jsonTxt) {
		if (err) throw err;
		var json = JSON.parse(jsonTxt)
		json.moment = moment
		var fn = jade.compileFile('./resume.jade',{pretty: true})
		var html = fn(json)
		console.log(html);
		fs.writeFile(outputHtml, html, 'utf8', function (err) {
		  if (err) throw err;
		  console.log((outputHtml + ' saved!').info);
		})
	})
}
