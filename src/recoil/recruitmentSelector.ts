import { selector } from "recoil";
import { getRecruitmentData, ProjectType, recruitment } from "./recruitment";

const recruitmentSelector =  selector<ProjectType[]>({
  key: 'initialRecruitmentState',
  get: async({ get }) => {
    const recruitmentData = get(recruitment);

    return getRecruitmentData(recruitmentData);
  },
  set: ({  get, set }) => {
    const data = get(recruitment)
    set(recruitment, data)
  }
})
export default recruitmentSelector