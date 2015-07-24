react-workshop
==============

A workspace for developing React components using Browserify/CommonJS.

## Install

```
npm install
```

## Add components

### Steps
1. Add components and component files in `src/components`.

2. For the moment, it is necessary to manually add the components main file to the Gruntfile in order to create a bundle.    

		```
		browserify: {
			build: {
				files: {
					'build/main.js': ['src/main.jsx'],
					'build/components/helloworld/helloworld.js': ['src/components/helloworld/helloworld.jsx'],
					// Add something like ^^^^^ here.
				},
				options: {
					transform: ['reactify'],
					watch: true
				}
			}
		},
		```

3. (optional) Add a link to the html file that loads the component to src/index.html.

