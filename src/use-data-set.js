import { useQuery } from 'react-query'

export default function useDataSet(id) {
  const queryKey = ['dataSets', {
    id,
    params: { fields: ['id'] },
  }]

  return useQuery(queryKey, { enabled: !!id })
}
