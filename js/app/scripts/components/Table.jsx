import React from 'react';
import { Table as MuiTable, TableBody, TableFooter, TableHeader,
         TableHeaderColumn, TableRow, TableRowColumn }
  from 'material-ui/Table';

class Table extends React.Component {
  render() {
    const {fields, data} = this.props;

    const columns = _.map(fields, (fieldObj, fieldName) => {
      return <TableHeaderColumn key={fieldName}>{fieldObj.label}</TableHeaderColumn>;
    });

    const rows = _.map(data, (row) => {

      const cells = _.map(fields, (fieldObj, fieldName) => {
        return <TableRowColumn key={fieldName}>{row[fieldName].toString()}</TableRowColumn>
      });

      return (<TableRow key={row.id}>
        {cells}
      </TableRow>);

    });

    return (
      <MuiTable
        fixedHeader={true}
        selectable={true}
        multiSelectable={true}
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
  fields: React.PropTypes.object.isRequired,
  data: React.PropTypes.array.isRequired,
};

export default Table;
