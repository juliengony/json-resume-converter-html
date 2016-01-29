const program = require('commander')
const colors = require('colors')
const validate = require('jsonschema').validate
const fs = require('fs')
const jade = require('jade')
const moment = require('moment')
const less = require('less')
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
  .command('convert <file> <outputFolder>')
	.description('Convert the json provided by <file> to html file in the <outputFolder>')
	.option('-p, --photo <photoPath>', 'add photo')
	.option('-s, --style <style>', 'add style (the name should be an existing <style>.less file (ex: simple))')
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

function convertFile(file, outputFolder, cmd){
	console.log(('Converting ' + file + ' to ' + outputFolder).info)
	fs.readFile(file, 'utf8', function (err, jsonTxt) {
		if (err) throw err;
		var json = JSON.parse(jsonTxt)
		json.moment = moment
		var fn = jade.compileFile('./resume.jade',{pretty: true})
		if(cmd.style)
			json.style = cmd.style
		var html = fn(json)
		console.log(html);
		var outputHtml = outputFolder + '/' + json.profile.firstName + '_' + json.profile.lastName + '_resume.html'
		fs.writeFile(outputHtml, html, 'utf8', function (err) {
		  if (err) throw err
			if(cmd.style)
			{
				fs.readFile(cmd.style + '.less', 'utf8', function (err, css) {
					if (err) throw err;
					var options = cmd.photo ? {
					  modifyVars: {
					    'photo': cmd.photo
					  }
					} : {}
					less.render(css, options, function(error, output) {
						if(error) throw error
						var cssPath =  outputFolder + '/' + cmd.style + '.css'
						fs.writeFile(cssPath, output.css, 'utf8', function (err) {
							if(error) throw error
							console.log((cssPath + ' saved!').info);
						})
					})
				})
			}
			console.log((outputHtml + ' saved!').info);
		})
	})
}
