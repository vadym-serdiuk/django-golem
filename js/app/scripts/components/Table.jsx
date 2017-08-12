import React from 'react';
import { Table as MuiTable, TableBody, TableHeader,
         TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';
import { autobind } from "core-decorators";

class Table extends React.Component {

  @autobind
  onCellClick = (row, col) => {
    if (col > 0)
      this.props.onRowClick(this.props.data[row].pk);
  };

  render() {
    const {listFields, data} = this.props;

    const columns = _.map(
      listFields,
      (fieldObj) => {
        return <TableHeaderColumn key={fieldObj.name}>{fieldObj.label}</TableHeaderColumn>;
      }
    );

    const rows = _.map(data, (row) => {
      const cells = _.map(listFields, (fieldObj) => {
        const fieldName = fieldObj.name;
        return <TableRowColumn key={fieldName}>{(row[fieldName] || '').toString()}</TableRowColumn>
      });

      return (<TableRow key={row.pk}>
        {cells}
      </TableRow>);

    });

    return (
      <MuiTable
        fixedHeader={true}
        selectable={true}
        multiSelectable={true}
        onCellClick={this.onCellClick}
      >
        <TableHeader
          displaySelectAll={true}
          adjustForCheckbox={true}
          enableSelectAll={true}
        >
          <TableRow>
            {columns}
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={true}
          deselectOnClickaway={false}
          showRowHover={true}
          stripedRows={false}
        >
          {rows}
        </TableBody>
      </MuiTable>
    );
  }
}

Table.propTypes = {
  listFields: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      name: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      type: React.PropTypes.string.isRequired,
  })).isRequired,
  data: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  onRowClick: React.PropTypes.func,
};

export default Table;
