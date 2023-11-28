import { DeepPartial } from '@reduxjs/toolkit';

import { Query } from '#api';

import { DTOTask } from '#generated/types';

import { APITagsTasks as Tags, RequestsTasks as Requests } from './types';

const TasksAPI = Query.injectEndpoints({
  endpoints: build => ({
    getTasks: build.query<DTOTask[], Requests['getTasks']['args']>({
      query: args => ({
        url: '/tasks',
        method: 'get',
        ...args,
      }),
      providesTags: [Tags.TASKS],
    }),
    createTask: build.mutation<
      Requests['createTask']['response'],
      Requests['createTask']['args']
    >({
      query: args => ({
        url: '/tasks',
        method: 'post',
        ...args,
      }),
      invalidatesTags: [Tags.TASKS],
    }),
    updateTask: build.mutation<
      Requests['updateTask']['response'],
      Requests['updateTask']['args'] & { data: DeepPartial<DTOTask> }
    >({
      query: args => ({
        url: '/tasks/{id}',
        method: 'put',
        ...args,
      }),
      invalidatesTags: [Tags.TASKS],
    }),
    deleteTask: build.mutation<
      Requests['deleteTask']['response'],
      Requests['deleteTask']['args']
    >({
      query: args => ({
        url: '/tasks/{id}',
        method: 'delete',
        ...args,
      }),
      invalidatesTags: [Tags.TASKS],
    }),
    markTaskAsDone: build.mutation<
      Requests['markTaskAsDone']['response'],
      Requests['markTaskAsDone']['args']
    >({
      query: args => ({
        url: '/tasks/{id}/done',
        method: 'post',
        ...args,
      }),
      invalidatesTags: [Tags.TASKS],
    }),
    markTaskAsUndone: build.mutation<
      Requests['markTaskAsUndone']['response'],
      Requests['markTaskAsUndone']['args']
    >({
      query: args => ({
        url: '/tasks/{id}/cancel',
        method: 'post',
        ...args,
      }),
      invalidatesTags: [Tags.TASKS],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useMarkTaskAsDoneMutation,
  useMarkTaskAsUndoneMutation,
} = TasksAPI;
