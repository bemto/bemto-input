const bemto = require('bemto-components');
const styled = require('styled-components').default;
const css = require('styled-components').css;
const PropTypes = require('prop-types');

const BemtoInputOptions = {
  tag: 'span',
  initialState: props => ({
    isFocused: false,
    nativeChangeEvent: false,
    value: props.value || props.defaultValue
  }),
  lifecycle: {
    getDerivedStateFromProps: (nextProps, prevState) => {
      if (nextProps.value !== undefined && prevState.value !== undefined && nextProps.value !== prevState.value) {
        return { value: nextProps.value, nativeChangeEvent: false }
      }
      return null;
    },
    componentDidMount: (component) => {
      if (component.props.autoFocus) {
        component.elemRefs.Controller.focus();
      }
    },
    componentDidUpdate: (prevProps, prevState, snapshot, component) => {
      const isFocusChange = prevState.isFocused !== component.state.isFocused;
      if (component.props.autoFocus && !component.state.isFocused && !isFocusChange) {
        component.elemRefs.Controller.focus();
      }
      if (
        prevState.value !== component.state.value
        && component.props.onChange
        && !component.state.nativeChangeEvent
      ) {
        const event = new Event('change');
        let target = component.elemRefs.Controller;
        // If the Controller is not an input or a textarea, find it using the wrapper node
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          const inputWrap = component.elemRefs.ControllerWrap;
          const input = inputWrap && inputWrap.querySelector && inputWrap.querySelector('input, textarea');
          if (input && input.dispatchEvent) {
            target = input;
          }
        }
        if (target.dispatchEvent) {
          target.dispatchEvent(event);
          component.props.onChange(event);
        }
      }
    }
  },
  _disabled: props => !!props.disabled,
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
          createRef: true,
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
              acceptProps: { except: ['onChange', 'onFocus', 'onBlur', 'autoFocus'] },
              content: { children: true },
              createRef: true,
              props: {
                type: props => props.type || 'text',
                onChange: (props, state, component) => e => {
                  if (state.value !== e.target.value) {
                    props.onChange && props.onChange(e);
                    component.setState({ value: e.target.value, nativeChangeEvent: true });
                  }
                },
                onFocus: (props, state, component) => e => {
                  props.onFocus && props.onFocus(e);
                  component.setState({ isFocused: true });
                },
                onBlur: (props, state, component) => e => {
                  props.onBlur && props.onBlur(e);
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

const FocusCSS = function (styles) {
  return css`
    &__Controller:focus {
      outline: none;
    }

    &_focus > * > &__View {
      ${styles || ''}
    }
  `;
};

const HoverCSS = function (styles) {
  return styles.indexOf('&__') === -1 ? css`
    @media (pointer: fine) {
      :not(&_focus):not(&_disabled) > *:hover > &__View {
        ${styles}
      }
    }

    @supports (-moz-appearance:meterbar) {
      :not(&_focus):not(&_disabled) > *:hover > &__View {
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

const HocusCSS = function (styles) {
  return css`
    &__Controller:focus {
      outline: none;
    }

    &_focus:not(&_disabled) > * > &__View {
      ${styles}
    }

    @media (pointer: fine) {
      *:not(&_disabled) > *:hover > &__View {
        ${styles}
      }
    }

    @supports (-moz-appearance:meterbar) {
      *:not(&_disabled) > *:hover > &__View {
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
    -webkit-appearance: none; /* stylelint-disable-line property-no-vendor-prefix */
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

  /** Disables the input by adding `_disabled` modifier. */
  disabled: PropTypes.bool,

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
