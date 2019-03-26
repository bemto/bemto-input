This is a foundation for all the text input I use in my markup for more than 4 years. Now in a form of a React component, using [bemto-components](https://github.com/bemto/bemto-components) and [styled-components](https://www.styled-components.com/).

[![Build Status][build]][build-link] [![NPM package version][version]][version-link]

[build]: https://travis-ci.org/bemto/bemto-input.svg?branch=master
[build-link]: https://travis-ci.org/bemto/bemto-input
[version]: https://img.shields.io/npm/v/bemto-input.svg
[version-link]: https://www.npmjs.com/package/bemto-input

You can use it as a base for highly functional and stylable text inputs which provides basic reset & layout which you could later easily style by extending with styled-components (or use your external styles). This component has all the powers of bemto-components beneath, so you can use modifiers, polymorphic tags and all the other stuff. See the docs of [bemto-components](https://kizu.github.io/bemto-components/#elements) for more features and [this component's source code](https://github.com/bemto/bemto-input) to how easily it is done.

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

If you won't do anything else, you'd get just the foundation for complex inputs without any visual styles:

    // Don't use it like that though.

    <BemtoInput defaultValue="Hello, world!"/>

But that foundation can be really easily styled by [extending](https://www.styled-components.com/docs/basics#extending-styles):

    // That's now the proper usage:
    const Input = styled(BemtoInput)`
      &__Layout {
        padding: 5px 10px;
        color: #000;
      }
      &__View {
        border: 1px solid rgba(0,0,0,0.5);
        background: #FFF;
      }
      ${BemtoInput.hoverCSS(`
        border-color: #000;
      `)}
      &_focus &__View {
        box-shadow: 0 0 5px 2px blue;
      }
      &__Controller:focus {
        outline: none;
      }
      &__Placeholder {
        color: #AAA;
      }
    `;

    <Input __Placeholder='Styled, with a placeholder!'/>

### Inner Structure and Elements

The following Elements are available for styling and adding additional props (see the [section about Elements](https://kizu.github.io/bemto-components/#elements) for everything about how to use elements):

- The top level, which would accept only bemto props (those starting from underscore) plus `className` & `style` props.
- `__Controller` — is the actual input inside, would accept all the other props like `defaultValue`, `type` etc. Visually represents only the text of the input.
- `__View` — the visual representation of the input (except for the text), use all your visual styles except for those that affect layout for input on this.
- `__Layout` — wrapper for everything inside input, should be used in styles for setting the layout properties for the input. Represented as `<label>` in HTML, so clicking anywhere inside it would put focus into `__Controller`.
- `__Before` and `__After` — optional extra elements for stuff like icons, would be visible even when there is a lot of text inside input, but not under its overflow.
- `__OuterBefore` and `__OuterAfter` — optional extra elements that would be rendered outside of the input's label (so you could put other form elements there in case you'd want them to be a part of the input).
- `__Placeholder` — optional custom placeholder, would become deactivated (hidden by default) when input would get any value.
- `__PlaceholderHint` — another optional custom placeholder, but which would become deactivated as well as when there is a focus inside input. When present alongside `__Placeholder`, would make it become deactivated until you'd focus into input.

### Styling guide

When used with styled-components, you **must** extend the styles.

1. For the best result you should split the CSS for your inputs among two basic elements: `__Layout` for layout & text styles, and `__View` for everything else (like background, shadows, borders etc).

2. Whenever the `__Controller` is focused, whole input gets a `_focus` mofifier, which could be used for setting proper styles. Note that default focus outline is not suppressed, so you'll need to disable it manually, but only if you'd add a proper focus styles.

3. Placeholder elements get `_inactive` state whenever they're not active. By default they're hidden by `visibility: hidden`, but you could override it by setting `visibility: inherit` (not `visible`!) and doing whatever you want with that state instead.

#### `BemtoInput.focusCSS`

While adding focus styles is rather easy, you could want to utilize the `focusCSS` helper whenever you need to add styles just for `&__View`, as it does just that:

    const Input = styled(BemtoInput)`
      &__View {
        box-shadow: 0 0 0 1px;
      }

      /* Would be applied only for __View */
      ${BemtoInput.focusCSS(`
        background: yellow;
      `)}
    `;

    <Input defaultValue='focus me' />

You can notice that there is no default outline for `__Controller` — this helper removes it, and if you want you can just use it without styles to do that for you: `${BemtoInput.focusCSS()}`.

#### `BemtoInput.hoverCSS`

If you'd want to add a hover effect for your inputs, you could utilize a `hoverCSS` helper that bemto-input provides.

By default it would add styles to a `&__View` inside a hovered `&__Layout`, however if you'd pass any selector that would have `&__` inside, the default selector would be suppressed (this could change in the future, as I'd really want to has the default hovered `&__Layout` as context).

The point of this helper is to add hover styles in a way they won't be “sticky” at mobile iOS by wrapping them with some at-rules.

    const Input = styled(BemtoInput)`
      &__View {
        box-shadow: 0 0 0 1px;
      }

      /* Would be applied only for __View */
      ${BemtoInput.hoverCSS(`
        background: yellow;
      `)}

      /* Would just have added media queries and no extra selectors */
      ${BemtoInput.hoverCSS(`
        &__Layout:hover {
          color: red;
        }
      `)}
    `;

    <Input defaultValue='hover me' />

Note that the default styles (when used without `&__` inside) wouldn't be applied when the input is focused. So if you'd want to have the same behaviour for your overridden selectors, you would need to use `:not(&_focus):not(&_disabled)` by yourself:

    const Input = styled(BemtoInput)`
      &__View {
        box-shadow: 0 0 0 1px;
      }

      ${BemtoInput.hoverCSS(`
        background: yellow;
      `)}

      ${BemtoInput.hoverCSS(`
        &:not(&_focus):not(&_disabled) > &__Layout:hover {
          color: red;
        }
      `)}
    `;

    <Input defaultValue='hover me' />

Now, this example won't get red color when focused and hovered at the same time.

However, in most cases, it should be enough to use this helper without any selectors inside, by adding styles for `&__View` only.

#### `BemtoInput.hocusCSS`

Another helper available for inputs is `hocusCSS`. It applies styles for `&__View` (always for it, not like `hoverCSS`), but both when the input is hovered or focused. That makes it really easy to add nice accessible styles if they're not very bright (otherwise it would be better to use separate hover and focus styles).


    const Input = styled(BemtoInput)`
      &__View {
        box-shadow: 0 0 0 1px;
      }

      ${BemtoInput.hocusCSS(`
        background: yellow;
      `)}
    `;

    <Input defaultValue='hover or focus me' />

This helper also removes default outline from the `__Controller`.


### Other Examples

Basic usage for placeholders:

    const Input = styled(BemtoInput)`
      &__View {
        box-shadow: 0 0 0 1px;
      }

      &__Placeholder,
      &__PlaceholderHint {
        color: #AAA;
      }
    `;

    <div className='Grid'>
      <Input placeholder="Native placeholder" />

      <Input __Placeholder='Custom placeholder' />

      <Input __Placeholder='Custom placeholder' defaultValue='With default value' />

      <Input
        __Placeholder={
          <BemtoOverflower __Overflow='Shorter text!'>
            Can has Overflower/whatever inside
          </BemtoOverflower>
        }
      />

      <Input __PlaceholderHint='Placeholder hint (hides on focus)' />
      <Input __PlaceholderHint='Both placeholder and hint' __Placeholder='Only shows when focused' />
    </div>

It is really easy to make sliding hints like this, and/or combine with regular custom placeholder. Note that for overriding the default hiding of placeholders its enough to restore `visibility` to `inherit` for their `_inactive` state (never use `visible` for restoring visibility!)

    const Input = styled(BemtoInput)`
      margin-bottom: 1em;

      &__View {
        box-shadow: 0 0 0 1px;
      }

      &__Placeholder {
        color: #AAA;
        transition: opacity 0.3s;

        &_inactive {
          opacity: 0;
          visibility: inherit;
        }
      }

      &__PlaceholderHint {
        color: #AAA;

        transition: transform 0.3s;
        transform-origin: 0 0;

        &_inactive {
          visibility: inherit;
          transform: scale(0.75) translate(0, -100%);
        }
      }
    `;

    <div className='Grid'>
      <Input __PlaceholderHint="Sliding hint" />

      <Input
        __Placeholder="Some example here"
        __PlaceholderHint="Same, but also Placeholder"
      />
    </div>


Custom focus styles:

    const Input = styled(BemtoInput)`
      &__Layout {
        padding: 0 0.5em;
      }

      &__View {
        box-shadow: 0 0 0 1px;
      }

      /* Should we have a mixin for this? */
      &__Controller:focus {
        outline: none;
      }

      &_focus &__View {
        background: yellow;
      }
    `;

    <Input />

Adding content before/after both inside and outside of the input's area

    const Input = styled(BemtoInput)`
      &__Layout {
        padding: 0 0.5em;
      }

      &__View {
        box-shadow: 0 0 0 1px;
      }
    `;

    <Input
      __Before='foo:'
      __After=':bar'
      __OuterBefore={<button>lol</button>}
      __OuterAfter={<button>lol</button>}
    />
