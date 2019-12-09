import * as React from 'react';

export interface IListSelectorProps {
    items: any[],
    checkedItems: Map<string, boolean>,
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void,
}

export interface IListSelectorState {
    checkedItems: Map<string, boolean>,
}

export default class ListSelector extends React.Component<IListSelectorProps, IListSelectorState> {
    constructor(props: IListSelectorProps) {
        super(props);

        this.state = {
            checkedItems: this.props.checkedItems,
        }
    }
    
	static getDerivedStateFromProps(nextProps: IListSelectorProps, prevState: IListSelectorState) {
		return { checkedItems: nextProps.checkedItems }
    }
    
    public render() {
        return (
            <div className="selectable-list">
                <ul>
                    {this.props.items.map((item, index) => (
                        <li key={index}>
                            <input type="checkbox" value={item.id} name={item.id} 
                                    checked={this.state.checkedItems.get(String(item.id))}
                                    onChange={this.props.handleChange} />
                            {item.title}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
}
