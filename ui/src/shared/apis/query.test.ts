import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()

import {getQueryResult} from 'src/shared/apis/query'

// Types
import {VariableAssignment} from 'src/types'

// Utils
import {buildVarsOption} from 'src/variables/utils/buildVarsOption'

const variableAssignments: VariableAssignment[] = [
  {
    type: 'VariableAssignment',
    id: {type: 'Identifier', name: 'bucket'},
    init: {type: 'StringLiteral', value: 'Futile Devices'},
  },
  {
    type: 'VariableAssignment',
    id: {type: 'Identifier', name: 'base_query'},
    init: {type: 'StringLiteral', value: ''},
  },
  {
    type: 'VariableAssignment',
    id: {type: 'Identifier', name: 'values'},
    init: {type: 'StringLiteral', value: 'system'},
  },
  {
    type: 'VariableAssignment',
    id: {type: 'Identifier', name: 'broker_host'},
    init: {type: 'StringLiteral', value: ''},
  },
  {
    type: 'VariableAssignment',
    id: {type: 'Identifier', name: 'timeRangeStart'},
    init: {
      type: 'UnaryExpression',
      operator: '-',
      argument: {
        type: 'DurationLiteral',
        values: [{magnitude: 1, unit: 'h'}],
      },
    },
  },
  {
    type: 'VariableAssignment',
    id: {type: 'Identifier', name: 'timeRangeStop'},
    init: {
      type: 'CallExpression',
      callee: {type: 'Identifier', name: 'now'},
    },
  },
  {
    type: 'VariableAssignment',
    id: {type: 'Identifier', name: 'windowPeriod'},
    init: {
      type: 'DurationLiteral',
      values: [{magnitude: 10000, unit: 'ms'}],
    },
  },
]

const extern = buildVarsOption(variableAssignments)
const orgID = '674b23253171ee69'
const query = `from(bucket: "Default Bucket")
|> range(start: v.timeRangeStart, stop: v.timeRangeStop)
|> filter(fn: (r) => r["_measurement"] == "cpu")
|> filter(fn: (r) => r["_field"] == "usage_user")`

describe('Shared.APIs.Query.GetQueryResult', () => {
  it('Should allow queries to be cancellable with abortController', () => {
    const abortController = new AbortController()
    abortController.abort()
    expect(() => getQueryResult(orgID, query, extern, abortController)).toThrow(
      'The operation was aborted.'
    )
  })
  it("Should not allow queries to be cancelled if they've already resolved", async () => {
    const abortController = new AbortController()
    const promise = getQueryResult(orgID, query, extern, abortController)

    expect(promise).toBeInstanceOf(Promise)

    abortController.abort()
    const resolved = await promise
    expect(resolved).not.toBeInstanceOf(Promise)
    expect(resolved.status).toBe(200)
  })
  it('Should not allow queries to be cancelled if the abortController has not been passed in', async () => {
    const abortController = new AbortController()
    abortController.abort()
    const promise = getQueryResult(orgID, query, extern)
    expect(() =>
      getQueryResult(orgID, query, extern, abortController)
    ).not.toThrow('AbortError: The operation was aborted.')

    expect(promise).toBeInstanceOf(Promise)

    abortController.abort()
    const resolved = await promise
    expect(resolved).not.toBeInstanceOf(Promise)
    expect(resolved.status).toBe(200)
  })
})
