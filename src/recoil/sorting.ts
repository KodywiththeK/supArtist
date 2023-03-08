import { atom } from "recoil";

export interface sortDataType {
  except: boolean,
  sort: boolean, 
  genre: string[],
  team: string[],
  search: string
}

export const sortingDefaultValue:sortDataType = {
  except: false,
  sort: true,
  genre: [],
  team: [],
  search: ''
}

export const sorting = atom<sortDataType>({
  key: 'sortData',
  default: sortingDefaultValue
})