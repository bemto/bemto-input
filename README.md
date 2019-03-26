# bemto-input [![Build Status][build]][build-link] [![NPM package version][version]][version-link]

[build]: https://travis-ci.org/bemto/bemto-input.svg?branch=master
[build-link]: https://travis-ci.org/bemto/bemto-input
[version]: https://img.shields.io/npm/v/bemto-input.svg
[version-link]: https://www.npmjs.com/package/bemto-input

This is a foundation for all the text input I use in my markup for more than 4 years. Now in a form of a React component, using [bemto-components](https://github.com/bemto/bemto-components) and [styled-components](https://www.styled-components.com/).

You can use it as a base for highly functional and stylable text inputs which provides basic reset & layout which you could later easily style by extending with styled-components (or use your external styles). This component has all the powers of bemto-components beneath, so you can use modifiers, polymorphic tags and all the other stuff. See the docs of [bemto-components](https://kizu.github.io/bemto-components/#elements) for more features and [this component's source code](https://github.com/bemto/bemto-input) to how easily it is done.

[Each example at **documentation** is an interactive playground](https://kizu.github.io/bemto-components/#bemtoinput)

### Installation & Usage

Note: `bemto-input` uses [styled-components](https://www.styled-components.com/) as a peer dependency, as its bad to include more than one instance of styled-components in your app, so you need to have it installed as well.

In your console:

``` sh
npm install --save bemto-input
```

Then in `.js`-files of your components:

``` js static
import BemtoInput from 'bemto-input';
```

## License

Licensed under the MIT License, Copyright © 2017 Roman Komarov.

See [LICENSE](./) for more information.
