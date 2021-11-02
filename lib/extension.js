"use strict";

/*
Copyright (c) 2016, 2021 Vincent Hiribarren

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const vscode = require('vscode');
const path = require('path');
const engine = require('./engine.js');
const Hashids = require('./hashids.js');

const CONF_HIGHSCORE_LINES = "tetromino.highscore.lines";
const HASHIDS_SEED = "tetromino";
const HASHIDS_MINLEN = 10;
const hashids = new Hashids(HASHIDS_SEED, HASHIDS_MINLEN);


let currentPanel;
let game;

function extensionIsActive(active) {
    console.log("tetromino: keybindings are active:", active);
    vscode.commands.executeCommand('setContext', 'tetromino.panel.active', active);
}


function activate(context) {
    console.log("tetromino: register Tetromino extension");
    context.subscriptions.push(
        vscode.commands.registerCommand('tetromino.play', () => playCommand(context)),
        vscode.commands.registerCommand('tetromino.command.left', () => game?.moveLeft()),
        vscode.commands.registerCommand('tetromino.command.right', () => game?.moveRight()),
        vscode.commands.registerCommand('tetromino.command.rotateRight', () => game?.rotateRight()),
        vscode.commands.registerCommand('tetromino.command.rotateLeft', () => game?.rotateLeft()),
        vscode.commands.registerCommand('tetromino.command.pause', () => game?.pause()), 
        vscode.commands.registerCommand('tetromino.command.down', () => game?.moveDown())
    );
}


function deactivate() {
    console.log("tetromino: unregister Tetromino extension");
}


function generateWebview({stylesheetHref, game}) { return `
    <!DOCTYPE html>
    <title>Tetromino</title>
    <link rel="stylesheet" href="${stylesheetHref}">
    ${game}
`;}


function playCommand(context) {
    const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn
        : undefined;
    if (currentPanel) {
        currentPanel.reveal(columnToShowIn);
        return;
    }
    extensionIsActive(true);
    currentPanel = vscode.window.createWebviewPanel(
        'tetromino',
        'Tetromino',
        columnToShowIn,
        {}
    );
    currentPanel.onDidChangeViewState(event => {
        const panelIsActive = event.webviewPanel.active;
        extensionIsActive(panelIsActive);
        console.log("tetromino: panel is active:", panelIsActive);
        if (! panelIsActive) {
            game?.pause();
        }
    });
    currentPanel.onDidDispose(
        event => {
            extensionIsActive(false);
            currentPanel = undefined;
        },
        null,
        context.subscriptions
    );

    const stylesheetUri = vscode.Uri.file(path.join(context.extensionPath, 'styles', 'tetromino.css'));
    const stylesheetWebviewUri = currentPanel.webview.asWebviewUri(stylesheetUri);

    let highScore = hashids.decode(context.globalState.get(CONF_HIGHSCORE_LINES) ||0);
    highScore = highScore[0] || 0;

    game = new engine.Game();
    game.highScoreLines = highScore;
    game.addListener(engine.EVENT_HIGHSCORE, () => {
        const newHighScoreLines = game.highScoreLines;
        if (newHighScoreLines > highScore) {
            context.globalState.update(CONF_HIGHSCORE_LINES, hashids.encode(newHighScoreLines));
            highScore = newHighScoreLines;
        }
    });
    game.addListener(engine.EVENT_REDRAW, () => {
        const vars = {
            game: game.view,
            stylesheetHref: stylesheetWebviewUri,
        };
        currentPanel.webview.html = generateWebview(vars);       
    });

}


module.exports = {
	activate,
	deactivate
};