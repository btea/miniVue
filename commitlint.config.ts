export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'header-max-length': [2, 'always', 80],
    'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert', 'ci', 'chore']]
  }
}
