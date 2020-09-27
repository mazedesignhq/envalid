/* eslint-disable no-console */
import { EnvMissingError } from './validators'

const colorWith = (colorCode: string) => (str: string) => `\x1b[${colorCode}m${str}\x1b[0m`
const colors = {
  blue: colorWith('34'),
  white: colorWith('37'),
  yellow: colorWith('33'),
}

const RULE = colors.white('================================')

const defaultReporter = ({ errors = {} }: { errors: { [key: string]: Error }; env: unknown }) => {
  const errorKeys = Object.keys(errors)
  if (!errorKeys.length) return

  const missingVarsOutput = []
  const invalidVarsOutput = []
  for (const k of errorKeys) {
    const err = errors[k]
    if (err instanceof EnvMissingError) {
      missingVarsOutput.push(`    ${colors.blue(k)}: ${errors[k].message || '(required)'}`)
    } else invalidVarsOutput.push(`    ${colors.blue(k)}: ${errors[k].message}`)
  }

  // Prepend "header" output for each section of the output:
  if (invalidVarsOutput.length) {
    invalidVarsOutput.unshift(` ${colors.yellow('Invalid')} environment variables:`)
  }
  if (missingVarsOutput.length) {
    missingVarsOutput.unshift(` ${colors.yellow('Missing')} environment variables:`)
  }

  const output = [
    RULE,
    invalidVarsOutput.join('\n'),
    missingVarsOutput.join('\n'),
    colors.yellow('\n Exiting with error code 1'),
    RULE,
  ]
    .filter(x => !!x)
    .join('\n')

  console.error(output)
  process.exit(1)
}

export default defaultReporter
