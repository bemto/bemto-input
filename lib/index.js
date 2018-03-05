const bemto = require('bemto-components');
const styled = require('styled-components').default;
const css = require('styled-components').css;
const PropTypes = require('prop-types');

const BemtoInputOptions = {
  tag: 'span',
  initialState: props => ({
    isFocused: false,
    value: props.value || props.defaultValue
  }),
  _empty: (props, state) => !state.value,
  _focus: (props, state) => state.isFocused,
  acceptProps: [],

  content: [
    { elem: 'OuterBefore', optional: true },
    {
      elem: 'Layout',
      tag: 'label',
      content: [
        {
          elem: 'View',
          props: {
            'aria-hidden': true
          }
        },
        { elem: 'Before', optional: true },
        {
          elem: 'ControllerWrap',
          content: [
            {
              elem: 'Placeholder',
              optional: true,
              props: {
                'aria-hidden': true
              },
              _inactive: (props, state) => !!state.value || props.__PlaceholderHint && !state.isFocused
            },
            {
              elem: 'PlaceholderHint',
              optional: true,
              _inactive: (props, state) => !!state.value || state.isFocused
            },
            {
              elem: 'Controller',
              tag: 'input',
              acceptProps: true,
              content: { children: true },
              props: {
                type: props => props.type || 'text',
                onChange: (props, state, component) => e => {
                  props.onChange && props.onChange();
                  component.setState({ value: e.target.value });
                },
                onFocus: (props, state, component) => () => {
                  props.onFocus && props.onFocus();
                  component.setState({ isFocused: true });
                },
                onBlur: (props, state, component) => () => {
                  props.onBlur && props.onBlur();
                  component.setState({ isFocused: false });
                }
              }
            }
          ]
        },
        { elem: 'After', optional: true }
      ]
    },
    { elem: 'OuterAfter', optional: true }
  ]
};

const BemtoInputTag = bemto(BemtoInputOptions);

const FocusCSS = function(styles) {
  return css`
    &__Controller:focus {
      outline: none;
    }

    &_focus > * > &__View {
      ${styles || ''}
    }
  `;
};

const HoverCSS = function(styles) {
  return styles.indexOf('&__') === -1 ? css`
    @media (pointer: fine) {
      :not(&_focus) > *:hover > &__View {
        ${styles}
      }
    }
    @supports (-moz-appearance:meterbar) {
      :not(&_focus) > *:hover > &__View {
        ${styles}
      }
    }
  ` : css`
    @media (pointer: fine) {
      ${styles}
    }
    @supports (-moz-appearance:meterbar) {
      ${styles}
    }
  `;
};

const HocusCSS = function(styles) {
  return css`
    &__Controller:focus {
      outline: none;
    }

    &_focus > * > &__View {
      ${styles}
    }

    @media (pointer: fine) {
      *:hover > &__View {
        ${styles}
      }
    }
    @supports (-moz-appearance:meterbar) {
      *:hover > &__View {
        ${styles}
      }
    }
  `;
};

const BemtoInput = styled(BemtoInputTag)`
  position: relative;
  z-index: 1;

  display: inline-block;
  display: inline-flex;

  box-sizing: border-box;
  width: 300px;
  max-width: 100%;

  &__OuterBefore,
  &__OuterAfter,
  &__Before,
  &__After {
    flex-shrink: 0;
  }

  &__Layout {
    position: relative; /* Optional */
    display: inline-block;
    display: inline-flex;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;

    cursor: text;
  }

  &__View {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: -1;
  }

  &__ControllerWrap {
    position: relative;
    flex-grow: 1;
    flex-shrink: 1;
    min-width: 0;
  }

  &__Placeholder,
  &__PlaceholderHint {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &_inactive {
      visibility: hidden;
    }
  }

  &__Controller {
    -webkit-appearance: none;
    display: inline-block;
    vertical-align: baseline;

    resize: none;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-width: 0;
    padding: 0;
    margin: 0;
    border: none;

    font: inherit;

    color: inherit;
    background: transparent;
    border-radius: 0;
    box-shadow: none;

    &::-ms-clear {
      display: none;
    }
  }
`;

// It gets most of the propTypes from the bemto(),
// but we need to ensure some stuff there anyway.
BemtoInput.propTypes = {
  /** Default value for input (this and most other props are passed to the input inside) */
  defaultValue: PropTypes.string,

  /** Custom placeholder that hides when input is not empty. If `__PlaceholderHint` is present, shows only on focus when empty. */
  __Placeholder: bemto.DefaultPropTypes.elem,

  /** Custom placeholder that hides when input is not empty or focused */
  __PlaceholderHint: bemto.DefaultPropTypes.elem,

  /** Optional [element](#elements) (inside label) */
  __Before: bemto.DefaultPropTypes.elem,

  /** Optional [element](#elements) (inside label) */
  __After: bemto.DefaultPropTypes.elem,

  /** Optional outer [element](#elements) (outside label) */
  __OuterBefore: bemto.DefaultPropTypes.elem,

  /** Optional outer [element](#elements) (outside label) */
  __OuterAfter: bemto.DefaultPropTypes.elem
};

BemtoInput.focusCSS = FocusCSS;
BemtoInput.hoverCSS = HoverCSS;
BemtoInput.hocusCSS = HocusCSS;

/** @component */
export default BemtoInput;
