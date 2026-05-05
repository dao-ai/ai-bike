import {
  Button,
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
  mergeStyle,
  useCanvasState,
  useHostTheme,
  type CanvasHostTheme,
} from "cursor/canvas";

type SizeRow = {
  id: string;
  reach: number;
  stack: number;
  hta: number;
  sta: number;
  chainstay: number;
};

/** 演示数据：与常见耐力/林道车架几何表同构，非某一实车官方表 */
const SIZE_TABLE: SizeRow[] = [
  { id: "XS", reach: 415, stack: 615, hta: 64, sta: 79, chainstay: 434 },
  { id: "S", reach: 442, stack: 615, hta: 64, sta: 79, chainstay: 434 },
  { id: "M", reach: 470, stack: 615, hta: 64, sta: 79, chainstay: 434 },
  { id: "L", reach: 498, stack: 625, hta: 64, sta: 79, chainstay: 437.5 },
  { id: "XL", reach: 525, stack: 638, hta: 64, sta: 79, chainstay: 437.5 },
];

function findRow(id: string): SizeRow {
  return SIZE_TABLE.find((r) => r.id === id) ?? SIZE_TABLE[2];
}

function FrameSvg({
  theme,
  row,
  variant,
}: {
  theme: CanvasHostTheme;
  row: SizeRow;
  variant: "inline" | "modal";
}) {
  const w = variant === "modal" ? 420 : 280;
  const h = variant === "modal" ? 300 : 200;
  const scale = (row.reach - 380) * 0.12 + (variant === "modal" ? 1.15 : 0.85);
  const seatH = 55 + (row.stack - 580) * 0.08;
  const topLen = 95 + (row.reach - 400) * 0.18;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ display: "block", maxWidth: "100%" }}
      aria-hidden
    >
      <title>车架示意 {row.id}</title>
      <rect
        x={0}
        y={0}
        width={w}
        height={h}
        fill={theme.fill.quaternary}
        stroke={theme.stroke.tertiary}
      />
      <g
        transform={`translate(${w * 0.22},${h * 0.72}) scale(${scale})`}
        stroke={theme.stroke.primary}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M 0 0 L 0 -55 L 55 -95 L 120 -95 L 140 -40 L 85 0 Z" />
        <path d="M 140 -40 L 175 -115" />
        <path d="M 0 -55 L -25 -130" />
        <circle cx={0} cy={0} r={4} fill={theme.accent.primary} />
      </g>
      <text
        x={12}
        y={22}
        fill={theme.text.secondary}
        style={{ fontSize: 11, fontFamily: "system-ui, sans-serif" }}
      >
        Reach {row.reach} mm · Stack {row.stack} mm
      </text>
      <text
        x={12}
        y={38}
        fill={theme.text.tertiary}
        style={{ fontSize: 10, fontFamily: "system-ui, sans-serif" }}
      >
        HTA {row.hta}° / STA {row.sta}° · CS {row.chainstay} mm
      </text>
      <line
        x1={w * 0.35}
        y1={h * 0.55}
        x2={w * 0.35 + topLen}
        y2={h * 0.55}
        stroke={theme.accent.control}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
      <line
        x1={w * 0.35}
        y1={h * 0.55}
        x2={w * 0.35}
        y2={h * 0.55 - seatH}
        stroke={theme.accent.control}
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />
    </svg>
  );
}

export default function BikeGeometryCanvas() {
  const theme = useHostTheme();
  const [sizeId, setSizeId] = useCanvasState<string>("geometry-size-id", "M");
  const [overlay, setOverlay] = useCanvasState<"closed" | "open">("geometry-overlay", "closed");

  const row = findRow(sizeId);

  return (
    <Stack gap={20} style={{ padding: 4 }}>
      <H1>自行车几何示意</H1>
      <Text tone="secondary">
        点选不同尺码（或下方表格中的尺码），右侧主视图与关键数字会联动；再点「弹出大图」在全屏层查看放大示意（仍为矢量示意，非厂商原图）。
      </Text>

      <Callout tone="info" title="说明">
        数据为知识库演示用；真实订车请以品牌官网 PDF 与店内 FIT 为准。
      </Callout>

      <Grid columns="minmax(0,1fr) minmax(0,1.1fr)" gap={20}>
        <Stack gap={12}>
          <H2>尺码</H2>
          <Row gap={8} wrap>
            {SIZE_TABLE.map((s) => (
              <Pill
                key={s.id}
                active={s.id === sizeId}
                onClick={() => setSizeId(s.id)}
                title={`切换到 ${s.id}`}
              >
                {s.id}
              </Pill>
            ))}
          </Row>
          <Divider />
          <H2>关键几何</H2>
          <Grid columns={2} gap={12}>
            <Stat value={`${row.reach}`} label="Reach (mm)" />
            <Stat value={`${row.stack}`} label="Stack (mm)" />
            <Stat value={`${row.hta}°`} label="头管角 HTA" />
            <Stat value={`${row.sta}°`} label="立管角 STA" />
          </Grid>
          <Table
            framed
            striped
            headers={["尺码", "Reach", "Stack", "后下叉"]}
            rows={SIZE_TABLE.map((s) => [
              <Pill
                key={s.id}
                active={s.id === sizeId}
                size="sm"
                onClick={() => setSizeId(s.id)}
              >
                {s.id}
              </Pill>,
              `${s.reach}`,
              `${s.stack}`,
              `${s.chainstay}`,
            ])}
            columnAlign={["left", "right", "right", "right"]}
            rowTone={SIZE_TABLE.map((s) => (s.id === sizeId ? "info" : undefined))}
          />
          <Row gap={8} align="center">
            <Button variant="primary" onClick={() => setOverlay("open")}>
              弹出大图
            </Button>
            <Button variant="ghost" onClick={() => setSizeId("M")}>
              重置为 M
            </Button>
          </Row>
        </Stack>

        <Card>
          <CardHeader trailing={<Pill active>{row.id}</Pill>}>主视图</CardHeader>
          <CardBody>
            <Stack gap={12}>
              <FrameSvg theme={theme} row={row} variant="inline" />
              <Text size="small" tone="tertiary">
                虚线表示 Reach / Stack 方向示意，三角简化为双三角车架轮廓。
              </Text>
            </Stack>
          </CardBody>
        </Card>
      </Grid>

      {overlay === "open" ? (
        <div
          role="presentation"
          style={mergeStyle({
            position: "fixed",
            inset: 0,
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.fill.tertiary,
          })}
          onClick={() => setOverlay("closed")}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`几何大图 ${row.id}`}
            style={mergeStyle({
              maxWidth: 520,
              width: "min(92vw, 520px)",
              padding: 16,
            })}
            onClick={(e) => e.stopPropagation()}
          >
            <Card>
              <CardHeader trailing={<Pill active>{row.id}</Pill>}>几何示意图</CardHeader>
              <CardBody style={{ paddingTop: 8 }}>
                <Stack gap={16}>
                  <Row justify="end">
                    <Button variant="ghost" onClick={() => setOverlay("closed")}>
                      关闭
                    </Button>
                  </Row>
                  <FrameSvg theme={theme} row={row} variant="modal" />
                  <Row gap={8} wrap>
                    {SIZE_TABLE.map((s) => (
                      <Pill
                        key={`m-${s.id}`}
                        active={s.id === sizeId}
                        onClick={() => setSizeId(s.id)}
                      >
                        {s.id}
                      </Pill>
                    ))}
                  </Row>
                  <Text size="small" tone="secondary">
                    在弹出层内切换尺码，示意图与上方主区域会通过同一状态同步更新。
                  </Text>
                </Stack>
              </CardBody>
            </Card>
          </div>
        </div>
      ) : null}
    </Stack>
  );
}
