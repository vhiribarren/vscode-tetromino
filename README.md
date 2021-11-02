# Tetromino

Another [tetromino][tetromino-wikipedia] falling block game implementation.

Remember the hidden tetromino game in Emacs using the `M-x tetris` command? I just wanted the same kind of useful tool with VSCode.

![TetrominoDemo](materials/tetromino.gif)

## Commands

Open the game using the command palette `Ctrl+Shift+P` (or `Cmd+Shift+P` on MacOS), then type `Tetromino`.

The current commands to play the game are:

- `left`: move block to left
- `right`: move block to right
- `bottom`: accelerate drop of block, press again to stop the fall
- `up`: rotate block to right
- `space`: rotate block to right
- `x`: rotate block to left
- `p`: pause

## Contributions

Contributions and bug reports are welcome. Please keep in mind that the whole idea of the project is to have a minimalist implementation of the tetromino falling block game, so the game must not evolve too much. It is only for fun, like the Emacs tetromino game.

## Third party licenses

The game uses the following third party library with their own licenses. Please check the file `LICENSE-3RD-PARTY.md` for the full license descriptions.

| Name    | License Type | Author       |
| ------- | ------------ | ------------ |
| Hashids | MIT          | Ivan Akimov


[tetromino-wikipedia]: https://en.wikipedia.org/wiki/Tetromino