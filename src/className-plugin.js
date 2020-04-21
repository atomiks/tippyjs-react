function updateClassName(box, action, classNames) {
  classNames.split(/\s+/).forEach(name => {
    if (name) {
      box.classList[action](name);
    }
  });
}

export const classNamePlugin = {
  name: 'className',
  defaultValue: '',
  fn(instance) {
    const box = instance.popper.firstElementChild;
    const isDefaultRenderFn = () => !!instance.props.render?.$$tippy;

    function add() {
      if (instance.props.className && !isDefaultRenderFn()) {
        if (process.env.NODE_ENV !== 'production') {
          console.warn(
            [
              '@tippyjs/react: Cannot use `className` prop in conjunction with',
              '`render` prop. Place the className on the element you are',
              'rendering.',
            ].join(' '),
          );
        }

        return;
      }

      updateClassName(box, 'add', instance.props.className);
    }

    function remove() {
      if (isDefaultRenderFn()) {
        updateClassName(box, 'remove', instance.props.className);
      }
    }

    return {
      onCreate: add,
      onBeforeUpdate: remove,
      onAfterUpdate: add,
    };
  },
};
