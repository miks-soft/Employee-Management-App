module.exports = plop => {
  plop.setGenerator('component', {
    description: 'Creates new component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (casing will be changed to dashCase)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{properCase name}}.tsx',
        templateFile: 'plop/component.hbs',
      },
      {
        type: 'append',
        path: 'src/components/index.tsx',
        pattern: '/* PLOP_INJECT_EXPORT */',
        template:
          "export { default as {{properCase name}} } from './{{properCase name}}';",
      },
    ],
  });

  plop.setGenerator('ui-kit', {
    description: 'Creates new ui-kit component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name (casing will be changed to dashCase)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/ui-kit/{{properCase name}}.tsx',
        templateFile: 'plop/component.hbs',
      },
      {
        type: 'append',
        path: 'src/ui-kit/index.tsx',
        pattern: '/* PLOP_INJECT_EXPORT */',
        template:
          "export { default as {{properCase name}} } from './{{properCase name}}';",
      },
    ],
  });

  plop.setGenerator('screen', {
    description: 'Creates new screen',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Screen name (casing will be changed to dashCase)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/screens/{{properCase name}}/index.tsx',
        templateFile: 'plop/screen/container.hbs',
      },
      {
        type: 'add',
        path: 'src/screens/{{properCase name}}/layout.tsx',
        templateFile: 'plop/screen/view.hbs',
      },
      {
        type: 'append',
        path: 'src/screens/index.tsx',
        pattern: '/* PLOP_INJECT_EXPORT */',
        template:
          "export { default as {{properCase name}} } from './{{properCase name}}';",
      },
    ],
  });

  plop.setGenerator('Modal', {
    description: 'Creates new modal',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Modal name (casing will be changed to dashCase)',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/modals/{{properCase name}}/index.tsx',
        templateFile: 'plop/screen/container.hbs',
      },
      {
        type: 'add',
        path: 'src/modals/{{properCase name}}/{{properCase name}}View.tsx',
        templateFile: 'plop/screen/view.hbs',
      },
      {
        type: 'append',
        path: 'src/modals/index.tsx',
        pattern: '/* PLOP_INJECT_EXPORT */',
        template:
          "export { default as {{properCase name}} } from './{{properCase name}}';",
      },
    ],
  });

  plop.setGenerator('icon', {
    description: 'Adds icon',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Enter IconName (eg: LeftArrow)',
      },
    ],
    actions: [
      {
        type: 'append',
        path: 'src/ui-kit/Icon.tsx',
        pattern: '/* PLOP_INJECT_KEY */',
        template:
          "  '{{kebabCase name}}': require('../assets/icons/{{kebabCase name}}.png'),",
      },
    ],
  });
};
