import React from 'react';
import { View, StyleSheet } from 'react-native';

import { DatePicker, H3, H4, Header, LineWrapper, Loader } from '#ui-kit';

import { ViewProps } from '.';

const Layout: React.FC<ViewProps> = props => {
  return (
    <View style={styles.container}>
      <Header
        containerStyle={styles.header}
        title="Моя статистика"
        onPressLeft={props.navigation.goBack}
      />
      <LineWrapper
        haveTopBorder
        style={styles.pickTimeLine}
      >
        <H4>Период с</H4>
        <DatePicker
          date={props.startDate}
          pickerProps={{
            maximumDate: props.endDate,
          }}
          onSet={props.setStartDate}
        />
        <H4>по</H4>
        <DatePicker
          date={props.endDate}
          pickerProps={{
            minimumDate: props.startDate,
          }}
          onSet={props.setEndDate}
        />
      </LineWrapper>

      {props.isLoading ? (
        <Loader fullscreen />
      ) : (
        <>
          <LineWrapper style={styles.infoLine}>
            <H3 style={styles.wrapFix}>Выполнено проектов</H3>
            <H3 weight="400">{props.statistics?.project_done || '0'}</H3>
          </LineWrapper>
          <LineWrapper style={styles.infoLine}>
            <H3 style={styles.wrapFix}>Начислено оплаты (баллы)</H3>
            <H3 weight="400">{props.statistics?.accrued_salaries || '0'}</H3>
          </LineWrapper>
          <LineWrapper style={styles.infoLine}>
            <H3 style={styles.wrapFix}>Выработка в часах</H3>
            <H3 weight="400">{props.statistics?.output_in_hours || '0'}</H3>
          </LineWrapper>
          <LineWrapper style={styles.infoLine}>
            <H3 style={styles.wrapFix}>
              Количество дней с неправильным началом/концом дня
            </H3>
            <H3 weight="400">{props.statistics?.count_days_with_fine}</H3>
          </LineWrapper>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapFix: {
    flex: 1,
  },
  infoLine: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    marginBottom: 16,
  },
  pickTimeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 8,
  },
});

export default Layout;
