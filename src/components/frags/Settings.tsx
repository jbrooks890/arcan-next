type SettingInputType = {
  range: [number, number];
  toggle: boolean;
  select: (string | number)[];
};

type SettingType = {
  [key: string]: { [TProp in keyof SettingInputType]: TProp };
};

type PropsType = { options: SettingType };

export default function Settings({ options }: PropsType) {
  const renderUI = () => {};

  return <div>Settings</div>;
}
