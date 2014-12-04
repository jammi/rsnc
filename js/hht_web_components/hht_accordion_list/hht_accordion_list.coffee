HHTAccordionList = HControl.extend

  controlDefaults: HControlDefaults.extend
    selectValue: null
    dateValue: null
    listValues: null
    showSearch: false
    showDropdown: false
    showFade: false
    showButton: false
    searchText: ''
    itemClass: null
    dropdownValue: null
    dropdownItems: null
    dropdownAutoSelect: false
    metaItemClass: null
    buttonType: 'blue'
    buttonLabel: ''
    buttonClick: null
    emptyText: ''
    rowHeight: 60
    allowUnselect: true

  drawSubviews: ->
    #Search
    _listTop = 2
    if @options.showSearch == true
      HHTSearchField.new( [ 0, 7, null, 30, 0, null ], @,
        bind: @options.listValues.list_search
        helpText: @options.searchText
        tabIndex: -1
      )
      _listTop += 39
    if @options.showDropdown == true
      HHTDropdown.new( [ 0, _listTop, null, 30, 0, null ], @,
        bind: @options.dropdownValue
        items: @options.dropdownItems
        autoSelect: @options.dropdownAutoSelect
        sortBy: false
      )    
      _listTop += 39

    #Button
    if @options.showButton == true
      _listBottom = 42
      HHTButton.new( [ 0, null, null, 40, 0, 0 ], @,
        type: @options.buttonType
        label: @options.buttonLabel
        click: @options.buttonClick
      )
    else
      _listBottom = 2

    #List
    @list = HHTBufferList.new( [ 0, _listTop, null, null, 0, _listBottom ], @,
      bind: @options.selectValue
      dateValue: @options.dateValue
      values: @options.listValues
      itemClass: @options.itemClass
      itemOpts: @options.itemOpts
      metaItemClass: @options.metaItemClass
      emptyText: @options.emptyText
      rowHeight: @options.rowHeight
      isSelected: @options.isSelected
      allowUnselect: @options.allowUnselect
    )

    #Fade Outs
    if @options.showFade == true
      HHTFadeOut.new( [ 0, _listTop, null, 40, 0, null ], @, { align: 'top' } )
      HHTFadeOut.new( [ 0, null, null, 40, 0, _listBottom ], @, { align: 'bottom' } )
    true
