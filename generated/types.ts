import { EnumTaskStatus } from '#config/enums';

import { components, paths } from './api';

export type DTOLogin = components['schemas']['login'];
export type DTOSendPasswordResetCode =
  components['schemas']['send-password-reset-code'];
export type DTOResetPassword = components['schemas']['reset-password'];
export type DTOLogout = components['schemas']['logout'];
export type DTOCompanyData = components['schemas']['company-data'];
export type DTOCompanyDataUpdate = components['schemas']['company-data-update'];
export type DTOEmployee = components['schemas']['employee'];
export type DTOProject = components['schemas']['project'] & {
  project_id: string;
  project_title: string;
};
export type DTOSpeciality = components['schemas']['speciality'];
export type DTOSpecialityteaser = components['schemas']['speciality_teaser'];
export type DTOSpecialitywithprojects =
  components['schemas']['speciality_with_projects'];
export type DTOStep = components['schemas']['step'];
export type DTOSchedule = components['schemas']['Schedule'];
export type DTOVacancy = components['schemas']['vacancy'];
export type DTOWorktime = components['schemas']['worktime'];

export type DTOUser = NonNullable<
  paths['/api/v1/user/current']['get']['responses']['200']['content']['application/json']['data']
> & {
  hide_statistic?: boolean;
};
export type DTOTask = Omit<
  NonNullable<
    paths['/api/v1/tasks/{id}']['get']['responses']['200']['content']['application/json']['data']
  >,
  'status'
> & {
  status: EnumTaskStatus;
  project_title: string;
};

const exampleObject = {
  id: 'b9b999c0-44c4-42ac-a153-2aae79add065',
  title: 'Кузьмы Чорного',
  start_work: '26.10.2022',
  end_work: '31.10.23',
  workday_start: '10:00',
  workday_end: '19:00',
  description: '',
  average_time: '',
  planned_time: '',
  disable_time_check: false,
  even_week: {
    fri: true,
    mon: true,
    sat: false,
    sun: false,
    thu: true,
    tue: true,
    wed: true,
  },
  odd_week: {
    fri: true,
    mon: true,
    sat: false,
    sun: false,
    thu: true,
    tue: true,
    wed: true,
  },
  payment: 111111,
};

export type DTOObjectDetails = typeof exampleObject;
export type DTOObject = Omit<
  DTOObjectDetails,
  'average_time' | 'description' | 'disable_time_check' | 'planned_time'
>;

const exampleTimeTracking = {
  id: 'b768bed0-4040-453e-a43e-9281521704cd',
  date: '03.02.2023',
  tracked_time: '',
  planned_time: '09:00',
};

export type DTOObjectTimeTrack = typeof exampleTimeTracking;

const exampleProjectSchedule = {
  id: 'b768bed0-4040-453e-a43e-9281521704cd',
  title: '30.08.2022',
  workday_start: '09:00',
  workday_end: '19:00',
  dinner_start: '17:00',
  dinner_end: '18:00',
  work_time: 600,
  dinner_time: 60,
};

export type DTOProjectSchedule = typeof exampleProjectSchedule;

export type DTOChat = {
  id: string;
  text?: string;
  count_unread: number;
  created_at: string;
  toUser?: {
    id: string;
    name: string;
    image?: string;
  };
  project?: {
    id: string;
    title: string;
  };
  unique_id: string;
};

export type DTOMessage = {
  id: string;
  image: string;
  name: string;
  project_id?: string;
  from_user_id?: string;
  to_user_id?: string;
  project_users?: string[];
  text: string;
  created_at: string;
};

export type DTOProjectVacancy = {
  id: string;
  radius: number;
  lat: string;
  lng: string;
  title?: string;
  workday_start?: string;
  workday_end?: string;
  dinner_start?: string;
  dinner_end?: string;
  work_time?: number;
  dinner_time?: number;
  worked_out?: string;
  is_time_tracking?: string;
};
