"use strict";
var daemon = require('../daemon');

async function buildExpectedRange(givenResult,uri){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')
  var severityIndex = givenResult.headers.cells.indexOf('severity')
  var messageIndex = givenResult.headers.cells.indexOf('message')

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells
      
    var result = await buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex],
      expectedDiagnostic[severityIndex],
      expectedDiagnostic[messageIndex]);
      expectedDiagnostic.uri = uri;
      expectedResult.push(result)
    }
  return expectedResult
}  

async function buildExpectedCodeLens(givenResult,projectPath,filePath){
  var expectedResult = [];
  
  var lineIndex = givenResult.headers.cells.indexOf('line')
  var rangeStartIndex = givenResult.headers.cells.indexOf('range_start')
  var rangeEndIndex = givenResult.headers.cells.indexOf('range_end')

  var titleIndex = givenResult.headers.cells.indexOf('title')
  var commandIndex = givenResult.headers.cells.indexOf('command')
  var argumentsIndex = givenResult.headers.cells.indexOf('arguments')

  for (var rowIndex = 0; rowIndex < givenResult.rows.length; rowIndex++) {
    var expectedDiagnostic = givenResult.rows[rowIndex].cells

    var result = await buildRange(expectedDiagnostic[lineIndex],
      expectedDiagnostic[rangeStartIndex],
      expectedDiagnostic[rangeEndIndex]);

    result.command = await buildCommand(expectedDiagnostic[titleIndex],
      expectedDiagnostic[commandIndex],
      expectedDiagnostic[argumentsIndex],
      projectPath,filePath);
  
    expectedResult.push(result)
  }
  return expectedResult
}

async function buildCommand(title,command,args,projectPath,filePath){
  var result = {}

  result.title = title
  result.command = command
  result.arguments = [];
  result.arguments.push(args.replace('%project_uri%',projectPath)
  .replace('%file_uri%',filePath))

  return result;
}

async function buildPosition(line,index){
  return {"line": parseInt(line),
  "character": parseInt(index)}
}

async function buildRange(line,rangeStart,rangeEnd,severity,message){
  var result = {}
  if(severity){
    result.severity = parseInt(severity)
  }
  if(message){
    result.message = message
  }

  result.range = {
    "start": await buildPosition(line,rangeStart),
    "end": await buildPosition(line,rangeEnd)
  };
  return result;
}
    
module.exports={
  buildExpectedRange:buildExpectedRange,
  buildExpectedCodeLens:buildExpectedCodeLens
}