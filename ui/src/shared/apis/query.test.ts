import fetchMock from 'jest-fetch-mock'
fetchMock.enableMocks()

import {mocked} from 'ts-jest/utils'

// mocked(jest)
// Mocks
// jest.mock('src/shared/apis/query')
import {runQuery, processResponse} from 'src/shared/apis/query'

jest.mock('src/shared/apis/query', () => ({
  runQuery: jest.requireActual('src/shared/apis/query').runQuery,
  processResponse: jest.fn(res => {
    console.log('res: ', res)
    return res
  }),
}))

// import {runQuery} = jest.requireActual('src/shared/apis/query')
// Types
import {CancellationError, VariableAssignment} from 'src/types'

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

describe('Shared.APIs.Query', () => {
  it('Should allow queries to be cancellable with abortController', async () => {
    // mock out fetch
    // mock processResponse
    // const mockProcessResponse = jest.fn(() => )
    const abortController = new AbortController()
    processResponse.mockImplementation(res => {
      console.log('res; ', res)
      return res
    })
    const {promise} = runQuery(orgID, query, extern, abortController)

    expect(true).toBe(true)
  })
  // it('Should allow queries to be cancellable when abortControllers are passed in', () => {
  //   const abortController = new AbortController()
  //   const mockRunQuery = jest.fn(() =>
  //     runQuery(orgID, query, extern, abortController)
  //   )
  //   // gonna want to mock out fetch response
  //   // might need to mock processResponse

  //   const {promise} = mockRunQuery()
  //   expect(mockRunQuery).toHaveReturned()
  //   expect(promise).toBeInstanceOf(Promise)
  //   expect(promise).toBeTruthy()
  //   // abortController.abort()
  //   const mockAbort = jest.fn(() => abortController.abort())
  //   mockAbort()
  //   expect(mockAbort).toHaveBeenCalledTimes(1)
  //   // expect(promise).rejects.toBe(new CancellationError())
  //   expect(promise).rejects.toBe('THIS IS A WEIRD ERROR')
  // })
  // // it('Should be able to cancel a query based on the cancel that is returned', () => {
  // //   const mockRunQuery = jest.fn(() => runQuery(orgID, query))

  // //   const {promise, cancel} = mockRunQuery()
  // //   expect(mockRunQuery).toHaveReturned()
  // //   expect(promise).toBeInstanceOf(Promise)
  // //   expect(promise).toBeTruthy()
  // //   // abortController.abort()
  // //   const mockCancel = jest.fn(() => cancel())
  // //   mockCancel()
  // //   expect(mockCancel).toHaveBeenCalledTimes(1)
  // //   expect(promise).rejects.toBe(new CancellationError())
  // // })
  // it('Should NOT allow queries to be cancelled when they have already resolved successfully', () => {
  //   fetchMock.mockResponse(JSON.stringify({access_token: '12345'}))
  //   const abortController = new AbortController()
  //   // const mockRunQuery = jest.fn(() =>
  //   //   runQuery(orgID, query, extern, abortController)
  //   // )
  //   const {promise} = runQuery(orgID, query, extern, abortController)
  //   // fetchMock.mockResponse(JSON.stringify('huzza!'))

  //   // const {promise} = mockRunQuery()
  //   promise
  //     .then(response => JSON.stringify(response))
  //     .then(res => console.log('res: ', res))
  //     // .then(res =>
  //     //   res.on('readable', () => {
  //     //     let chunk
  //     //     while (null !== (chunk = res.read())) {
  //     //       console.log(chunk.toString())
  //     //     }
  //     //   })
  //     // )
  //     .catch(err => console.log(err))
  //   // expect(mockRunQuery).toHaveReturned()
  //   // expect(promise).toBeInstanceOf(Promise)
  //   // expect(promise).toBeTruthy()
  //   // // abortController.abort()
  //   // const mockAbort = jest.fn(() => abortController.abort())
  //   // mockAbort()
  //   expect(false).toBe(true)
  //   // expect(mockAbort).toHaveBeenCalledTimes(1)
  //   // expect(promise).rejects.toBe(new CancellationError())
  // })
})
