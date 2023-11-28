import { store } from '#store';
import { TimerActions } from '#store/slices/timer';

const convertStartDateToOffset = () => {
  const timerState = store.getState().timer;

  if (timerState.startDate) {
    const offset =
      new Date().getTime() - new Date(timerState.startDate).getTime();

    Timer.set('', offset + timerState.offset);
  }

  if (timerState.pauseStartDate) {
    const offset =
      new Date().getTime() - new Date(timerState.pauseStartDate).getTime();

    Timer.setPause('', offset + timerState.pauseOffset);
  }
};

class Timer {
  static start() {
    convertStartDateToOffset();
    store.dispatch(TimerActions.setStartDate(new Date().toISOString()));
  }

  static end() {
    convertStartDateToOffset();
  }

  static pause() {
    convertStartDateToOffset();
    store.dispatch(TimerActions.setPauseStartDate(new Date().toISOString()));
  }

  static set(startDate: string, offset: number) {
    store.dispatch(TimerActions.setStartDate(startDate));
    store.dispatch(TimerActions.setOffset(offset));
  }

  static setPause(startDate: string, offset: number) {
    store.dispatch(TimerActions.setPauseStartDate(startDate));
    store.dispatch(TimerActions.setPauseOffset(offset));
  }

  static reset() {
    this.set('', 0);
    this.setPause('', 0);
  }
}

export default Timer;
