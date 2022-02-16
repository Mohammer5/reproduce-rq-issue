import React, { useState } from 'react'
import { Provider } from '@dhis2/app-runtime'
import { QueryClientProvider } from 'react-query'
import useQueryClient from './use-query-client.js'
import useDataSet from './use-data-set.js'

const ComponentWithQuery = ({ id }) => {
  const dataSet = useDataSet(id)

  return (
    <pre>
      <code>
        {JSON.stringify(dataSet, null, 2)}
      </code>
    </pre>
  )
}

const ids = ['Lpw6GcnTrmS', 'BfMAe6Itzgt']

const Setup = () => {
  const [id, setId] = useState(ids[0])
  const queryClient = useQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <button onClick={() => setId(id === ids[0] ? ids[1] : ids[0])}>
          Toggle id
        </button>

        <p>Current id: {id}</p>

        <ComponentWithQuery id={id} />
      </div>
    </QueryClientProvider>
  )
}

const MyApp = () => {
  return (
    <Provider config={{ baseUrl: 'https://debug.dhis2.org/dev', apiVersion: 33 }}>
      <Setup />
    </Provider>
  )
}

export default MyApp
