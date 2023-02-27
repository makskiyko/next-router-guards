import chalk from 'chalk';
import inquirer from 'inquirer';
import type {Answers, QuestionCollection} from 'inquirer';
import {autoInjectable, singleton} from 'tsyringe';

@autoInjectable()
@singleton()
export class Inquirer {
  public constructor() {
    this._printWelcome();
  }

  private _printWelcome(): void {
    console.log(chalk.green('┌────────────────────────┐'));
    console.log(chalk.green('│ Next router guards CLI │'));
    console.log(chalk.green('└────────────────────────┘'));
  }

  public print(message: string): void {
    console.log(message);
  }

  public error(message: string): void {
    console.log(chalk.red(message));
  }

  public prompt<TAnswers extends Answers>(questions: QuestionCollection<TAnswers>): Promise<TAnswers> {
    return inquirer.prompt(questions);
  }
}
