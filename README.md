# zokor

A tool for remotely debugging and testing your WebAPP(Integrated vorlon injection)

## start

`npm install -g zokor`

`zokor localPort`

*localPort:* Local dev server port

Maybe you want to test non-local project. You can still use the following way:

`zokor [dev server] [dev port]`

Example:

`zokor my.iwm.name 8080`

## config

`zokor config [config item] [config set]`

In zokor, You can freely switch bdwm or ele. 

Example:

`zokor config env bdwm`

or

`zokor config env ele`

You are free to choose the `mole-proxy` switch.

`zokor config mole open`

or

`zokor config mole close`

More custom features coming soon