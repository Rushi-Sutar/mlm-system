export default (state , action) => {
    switch (action.type) {
      case "EXTRA_COMMISSION_CUSTOMERS":
        return [...action?.data ];
      default:
        return state;
    }
  };
