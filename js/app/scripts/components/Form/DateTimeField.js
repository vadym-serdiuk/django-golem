import React from 'react';
import moment from 'moment';
import { FormsyDate, FormsyTime, FormsyText } from 'formsy-material-ui/lib';
import { autobind } from "core-decorators";

window.moment = moment;


class DateTimeField extends React.PureComponent {
  constructor (props) {
    super(props);
    if (props.value || 0) {
      const datetime = moment(props.value, moment.ISO_8601).local();
      this.state = {
        date: datetime.toDate(),
        time: datetime.toDate(),
        combinedValue: datetime.format('YYYY-MM-DDTHH:mm:ss'),
      }
    } else {
      this.state = {
        date: null,
        time: null,
        combinedValue: '',
      };
    }
  }

  @autobind
  onDateChange (e, value) {
    let combinedValue = this.state.combinedValue;
    let date = '';

    if (value) {
      date = moment(value).format('YYYY-MM-DD');
    }

    if (date) {
      const time = this.state.time;
      combinedValue = date + 'T' + (time ? moment(time).format('HH:mm:ss') : '00:00:00');
    } else {
      combinedValue = '';
    }
    this.setState({date: value, combinedValue});
  }

  @autobind
  onTimeChange (e, UTCtime) {
    let {combinedValue, date} = this.state;
    let time = '';
    if (date) {
      combinedValue = moment(date).format('YYYY-MM-DD') + 'T' + moment(UTCtime).format('HH:mm:ss');
    }
    this.setState({time: UTCtime, combinedValue});
  }

  render () {
    const {name, label, style={}, required=false} = this.props;
    const dateName = name + '-date';
    const timeName = name + '-time';

    return (
      <div style={{...style, padding: '10px 0', boxSizing: 'border-box'}}>
        <div>{label}</div>
        <FormsyDate
          DateTimeFormat={global.Intl.DateTimeFormat}
          name={dateName}
          hintText="Date"
          onChange={this.onDateChange}
          style={{display: 'inline-block', marginRight: '10px'}}
          autoOk={true}
          required={required}
          locale="uk-UA"
          value={this.state.date}
        />
        <FormsyTime
          name={timeName}
          hintText="Time"
          onChange={this.onTimeChange}
          style={{display: 'inline-block'}}
          format="24hr"
          autoOk={true}
          required={required}
          value={this.state.time}
        />
        <FormsyText name={name} value={this.state.combinedValue} type="hidden" style={{display: 'none'}} />
      </div>
    )
  }
}

export default DateTimeField
