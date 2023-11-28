export type StartLocationPushPayload = {
  vacancy_id: string;
  project_id: string;
  lat: string;
  lng: string;
  radius: number;
};

export type CollectDataPushPayload = {
  day_start: string;
  project_id: string;
  steps_date_from: string;
  steps_date_to: string;
  type: string;
  vacancy: string;
};
