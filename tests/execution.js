'use strict';
var assert = require('assert');

var languageclient = require('./lsp/languageclient');
var builder = require('./lsp/util/dataBuilder');

step('ensure code lens has details <data>', async function (data) {
    var details = builder.loadData(data)

    var expectedDetails = builder.buildExpectedCodeLens(details);  
    var file = details[0].uri

    try{
        var response = await languageclient.codeLens(file)
        handleCodeLensDetails(response,expectedDetails)    
    }
    catch(err){
        throw new Error("unable to verify code lens details "+err)
    }
});

function handleCodeLensDetails(responseMessage,expectedDetails){
    for (var rowIndex = 0; rowIndex < expectedDetails.length; rowIndex++) {
      var expectedDetail = expectedDetails[rowIndex]
      gauge.message("verify code lens details")

      assert.deepEqual(responseMessage[rowIndex].range, expectedDetail.range);
    }  
}