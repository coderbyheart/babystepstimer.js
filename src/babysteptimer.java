public class BabystepsTimer {
	private static DecimalFormat twoDigitsFormat = new DecimalFormat("00");

	public static void main(final String[] args) throws InterruptedException {
		timerPane.setEditable(false);
		timerPane.addMouseMotionListener(new MouseMotionListener() {
			private int lastX;
			private int lastY;

			@Override
			public void mouseMoved(final MouseEvent e) {
				lastX = e.getXOnScreen();
				lastY = e.getYOnScreen();
			}

			@Override
			public void mouseDragged(final MouseEvent e) {
				int x = e.getXOnScreen();
				int y = e.getYOnScreen();

				timerFrame.setLocation(timerFrame.getLocation().x + (x-lastX), timerFrame.getLocation().y + (y-lastY));

				lastX = x;
				lastY = y;
			}
		});
	}

	public static synchronized void playSound(final String url) {
		new Thread(new Runnable() {
			@Override
			public void run() {
				try {
					Clip clip = AudioSystem.getClip();
					AudioInputStream inputStream = AudioSystem.getAudioInputStream(
							BabystepsTimer.class.getResourceAsStream("/"+url));
					clip.open(inputStream);
					clip.start();
				} catch (Exception e) {
					System.err.println(e.getMessage());
				}
			}
		}).start();
	}

	private static final class TimerThread extends Thread {
		@Override
		public void run() {
			timerRunning = true;
			currentCycleStartTime = System.currentTimeMillis();

			while(timerRunning) {
				long elapsedTime = System.currentTimeMillis() - currentCycleStartTime;

				if(elapsedTime >= SECONDS_IN_CYCLE*1000+980) {
					currentCycleStartTime = System.currentTimeMillis();
					elapsedTime = System.currentTimeMillis() - currentCycleStartTime;
				}
				if(elapsedTime >= 5000 && elapsedTime < 6000 && !BACKGROUND_COLOR_NEUTRAL.equals(bodyBackgroundColor)) {
					bodyBackgroundColor = BACKGROUND_COLOR_NEUTRAL;
				}

				String remainingTime = getRemainingTimeCaption(elapsedTime);
				if(!remainingTime.equals(lastRemainingTime)) {
					if(remainingTime.equals("00:10")) {
						playSound("2166__suburban-grilla__bowl-struck.wav");
					} else if(remainingTime.equals("00:00")) {
						playSound("32304__acclivity__shipsbell.wav");
						bodyBackgroundColor=BACKGROUND_COLOR_FAILED;
					}

					timerPane.setText(createTimerHtml(remainingTime, bodyBackgroundColor, true));
					timerFrame.repaint();
					lastRemainingTime = remainingTime;
				}
				try {
					sleep(10);
				} catch (InterruptedException e) {
					//We don't really care about this one...
				}
			}
		}
	}
}
