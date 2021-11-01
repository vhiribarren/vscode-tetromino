const vscode = require('vscode');
const path = require('path');
const tetrominoEngine = require('./engine.js');
const Engine = require('./engine.js').Engine;


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

    game = new Engine();
    game.addListener(tetrominoEngine.EVENT_REDRAW, () => {
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