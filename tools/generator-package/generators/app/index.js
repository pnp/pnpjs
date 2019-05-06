'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the world-class ' + chalk.red('generator-package') + ' generator!'
    ));

    const prompts = [{
      type: 'input',
      name: 'name',
      message: 'name?',
      default: this.appname
    },
    {
      type: 'input',
      name: 'description',
      message: 'description?',
      default: ""
    }];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {

    this.fs.copyTpl(
      this.templatePath("**/*.*"),
      this.destinationPath(),
      {
        name: this.props.name,
        description: this.props.description,
      }
    );

    this.fs.write(`./src/${this.props.name}.ts`, "// TODO:: add package exports to this file");

  }

  install() { }
};
