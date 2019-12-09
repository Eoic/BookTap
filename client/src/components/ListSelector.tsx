import * as React from 'react';

export interface IListSelectorProps {
    items: any[],
    checkedItems: Map<string, boolean>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export default class ListSelector extends React.Component<IListSelectorProps> {
    constructor(props: IListSelectorProps) {
        super(props);
    }

    public render() {
        return (
            <div className="selectable-list">
                <ul>
                    {this.props.items.map((item, index) => (
                        <li key={index}>
                            <input type="checkbox" value={item.id} name={item.id} 
                                    checked={this.props.checkedItems.get(item.name)}
                                    onChange={this.props.handleChange} />
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
