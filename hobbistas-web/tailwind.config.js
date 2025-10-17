const { join } = require('node:path');
const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const daisyui = require('daisyui');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/*.{html,ts}'),

    join(__dirname, '../web/**/*.{html,ts}'),
    join(__dirname, '../shared/**/*.{html,ts}'),

    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: { extend: {} },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        core: {
          primary: '#6b5b95',
          secondary: '#88b04b',
          accent: '#f7cac9',
          neutral: '#2a2a2a',
          'base-100': '#0f0f11',
        },
      },
      {
        gaming: {
          primary: '#2dd4bf',
          secondary: '#60a5fa',
          accent: '#f59e0b',
          neutral: '#0b1220',
          'base-100': '#0a0f1a',
        },
      },
    ],
  },
};
