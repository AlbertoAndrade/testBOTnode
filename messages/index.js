/*-----------------------------------------------------------------------------
This template demonstrates how to use Waterfalls to collect input from a user using a sequence of steps.
For a complete walkthrough of creating this type of bot see the article at
https://docs.botframework.com/en-us/node/builder/chat/dialogs/#waterfall
AA branch02fff
-----------------------------------------------------------------------------*/
"use strict";
var builder = require("botbuilder");
var botbuilder_azure = require("botbuilder-azure");

var useEmulator = (process.env.NODE_ENV == 'development');

var connector = useEmulator ? new builder.ChatConnector() : new botbuilder_azure.BotServiceConnector({
    appId: process.env['MicrosoftAppId'],
    appPassword: process.env['MicrosoftAppPassword'],
    stateEndpoint: process.env['BotStateEndpoint'],
    openIdMetadata: process.env['BotOpenIdMetadata']
});

var bot = new builder.UniversalBot(connector);

bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, "Ingresa el # del Dispensador?");
    },
    function (session, results) {
        session.userData.dispensador = results.response;
        builder.Prompts.choice(session, "Seleciona la frase correcta",
            ["Cuando estoy entre locos, me hago el loco",
                "Nunca se mesclan el agua y el fuego"
                , "La belleza sin gracias es como anzuelo sin cebo",
                "Algunos gallos creen que el sol sale para ellos"]);
    },
    function (session, results) {
        session.userData.frase = results.response;
        builder.Prompts.choice(session, "Seleciona la cantidad",
            ["10", "20", "30", "50"]);
    },


    function (session, results) {
        session.userData.cantidad = results.response.entity;
        session.send("Retiro de " + session.userData.cantidad);
    }
]);

if (useEmulator) {
    var restify = require('restify');
    var server = restify.createServer();
    server.listen(3978, function() {
        console.log('test bot endpont at http://localhost:3978/api/messages');
    });
    server.post('/api/messages', connector.listen());    
} else {
    module.exports = { default: connector.listen() }
}
