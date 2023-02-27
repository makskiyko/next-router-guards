import chalk from 'chalk';
import inquirer from 'inquirer';
import type {Answers, QuestionCollection} from 'inquirer';
import {singleton} from 'tsyringe';

@singleton()
export class Inquirer {
  public constructor() {
    this._printWelcome();
  }

  private _printWelcome(): void {
    console.log(chalk.green('┌────────────────────────┐'));
    console.log(chalk.green('│ Next router guards CLI │'));
    console.log(chalk.green('└────────────────────────┘'));
    console.log('');
  }

  public print(message: string): void {
    console.log(message);
  }

  public error(message: string): void {
    console.log(chalk.red(message));
  }

  public success(message: string): void {
    console.log(chalk.green(message));
  }

  public prompt<TAnswers extends Answers>(questions: QuestionCollection<TAnswers>): Promise<TAnswers> {
    return inquirer.prompt(questions);
  }
}
