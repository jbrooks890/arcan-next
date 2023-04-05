export default function useProgressManager() {
  // TODO: NEED USER DATA

  const notify = (msg: string, header: string) => {};

  const startActivity = async (taskID: string): Promise<void> => {
    // POST TASK TO USER ACTIVITY ARRAY (AWAIT)
    // NOTIFY USER
  };

  const updateActivity = (taskID: string): void => {};

  const givePoints = (qty: number): void => {};

  const giveReward = (): void => {};

  const redeem = (cost: number) => {}; // PURCHASE [SOMETHING] WITH POINTS

  return {
    notify,
    startActivity,
    updateActivity,
    givePoints,
    giveReward,
    redeem,
  };
}
