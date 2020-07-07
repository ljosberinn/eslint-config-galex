module.exports = {
  'jsx-a11y/accessible-emoji': 'off',
  'jsx-a11y/autocomplete-valid': 'error',
  'jsx-a11y/control-has-associated-label': 'warn',
  'jsx-a11y/media-has-caption': 'warn',
  'jsx-a11y/no-autofocus': 'error',
  'no-redeclare': 'error',
  'react-hooks/exhaustive-deps': 'error',
  'react/button-has-type': 'error',
  'react/jsx-boolean-value': 'warn',
  'react/jsx-curly-brace-presence': [
    'warn',
    {
      children: 'never',
      props: 'never',
    },
  ],
  'react/jsx-fragments': ['warn', 'syntax'],
  'react/jsx-handler-names': [
    'warn',
    {
      checkLocalVariables: false,
      eventHandlerPrefix: 'handle',
      eventHandlerPropPrefix: 'on',
    },
  ],
  'react/jsx-key': ['warn', { checkFragmentShorthand: true }],
  'react/jsx-no-useless-fragment': 'warn',
  'react/no-children-prop': 'warn',
  'react/no-unknown-property': 'warn',
  'react/no-unused-prop-types': 'warn',
  'react/self-closing-comp': 'warn',
  'react/void-dom-elements-no-children': 'error',
};
