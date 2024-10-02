import store from './js/store.js';

const TabType = {
  KEYWORD: 'KEYWORD',
  HISTORY: 'HISTORY',
};

const TabLabel = {
  [TabType.KEYWORD]: '추천 검색어',
  [TabType.HISTORY]: '최근 검색어',
};

class App extends React.Component {
  constructor(props) {
    super();
    this.state = {
      searchKeyword: '',
      searchResult: [],
      submitted: false,
      selectedTab: TabType.KEYWORD,
      tabView: store.getKeywordList(),
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    this.search(this.state.searchKeyword);
  }

  search(searchKeyword) {
    const searchResult = store.search(searchKeyword);
    this.setState({ searchResult, submitted: true });
  }

  handleReset() {
    this.setState({ searchKeyword: '', submitted: false });
  }

  handleChangeInput(event) {
    const searchKeyword = event.target.value;

    if (searchKeyword.length <= 0 && this.state.submitted) {
      return this.handleReset();
    }

    this.setState({ searchKeyword: event.target.value });
  }

  handleClick(tabType) {
    if (tabType === TabType.HISTORY) {
      this.setState({ selectedTab: tabType, tabView: store.getHistoryList() });
    } else {
      this.setState({ selectedTab: tabType, tabView: store.getKeywordList() });
    }
  }

  render() {
    const searchForm = (
      <form
        onSubmit={(event) => this.handleSubmit(event)}
        onReset={() => this.handleReset()}>
        <input
          type='text'
          placeholder='검색어를 입력하세요'
          autoFocus
          value={this.state.searchKeyword}
          onChange={(event) => this.handleChangeInput(event)}
        />
        {this.state.searchKeyword.length > 0 && (
          <button type='reset' className='btn-reset'></button>
        )}
      </form>
    );

    const searchResult =
      this.state.searchResult.length > 0 ? (
        <ul className='result'>
          {this.state.searchResult.map(({ id, imageUrl, name }) => (
            <li key={id}>
              <img src={imageUrl} />
              <p>{name}</p>
            </li>
          ))}
        </ul>
      ) : (
        <div className='empty-box'>검색 결과가 없습니다</div>
      );

    const tabView = (
      <ul className='list'>
        {this.state.tabView.map((item) => (
          <li key={item.id}>
            {item.id}. {item.keyword}
          </li>
        ))}
      </ul>
    );

    const tabs = (
      <>
        <ul className='tabs'>
          {Object.values(TabType).map((tabType) => {
            return (
              <li
                className={this.state.selectedTab === tabType ? 'active' : ''}
                onClick={() => this.handleClick(tabType)}
                key={tabType}>
                {TabLabel[tabType]}
              </li>
            );
          })}
        </ul>
        {tabView}
      </>
    );

    return (
      <>
        <header>
          <h2 className='container'>검색</h2>
        </header>
        <div className='container'>
          {searchForm}
          <div className='content'>
            {this.state.submitted ? searchResult : tabs}
          </div>
        </div>
      </>
    );
  }
}

ReactDOM.render(<App />, document.querySelector('#app'));
